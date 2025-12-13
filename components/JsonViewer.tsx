import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewMode } from '../types';
import { ChevronRight, ChevronDown, Copy, Check, Search, PlusSquare, MinusSquare, X, Filter, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface JsonViewerProps {
  data: any;
  mode: ViewMode;
}

// Section Types for Logic
type Section = 'root' | 'report' | 'entry' | 'allocation' | 'attendee' | 'audit';

// Helper to determine next section based on key name
const getChildSection = (key: string, current: Section): Section => {
  if (['reports', 'report'].some(k => key.toLowerCase().includes(k))) return 'report';
  if (['entries', 'expenseentries'].some(k => key.toLowerCase().includes(k))) return 'entry';
  if (['allocations', 'itemizations'].some(k => key.toLowerCase().includes(k))) return 'allocation';
  if (['attendees'].some(k => key.toLowerCase().includes(k))) return 'attendee';
  if (['audit', 'workflow'].some(k => key.toLowerCase().includes(k))) return 'audit';
  return current;
};

// Color mapping for sections
const getSectionColor = (section: Section): string => {
  switch (section) {
    case 'report': return 'text-blue-700';
    case 'entry': return 'text-purple-700';
    case 'allocation': return 'text-orange-700';
    case 'attendee': return 'text-emerald-700';
    case 'audit': return 'text-slate-500';
    default: return 'text-slate-700';
  }
};

const getSectionBg = (section: Section): string => {
  switch (section) {
    case 'report': return 'bg-blue-50/50 border-blue-100';
    case 'entry': return 'bg-purple-50/50 border-purple-100';
    case 'allocation': return 'bg-orange-50/50 border-orange-100';
    case 'attendee': return 'bg-emerald-50/50 border-emerald-100';
    case 'audit': return 'bg-slate-50/50 border-slate-200';
    default: return 'hover:bg-slate-50';
  }
};

// Recursive search to find paths containing the term
const findPaths = (data: any, term: string, currentPath: string, results: Set<string>) => {
  if (!term) return;
  const lowerTerm = term.toLowerCase();

  // Check current value (if primitive)
  if (typeof data !== 'object' || data === null) {
    if (String(data).toLowerCase().includes(lowerTerm)) {
      results.add(currentPath);
    }
    return;
  }

  // Iterate keys
  Object.keys(data).forEach(key => {
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    
    // Check key match
    if (key.toLowerCase().includes(lowerTerm)) {
      results.add(newPath);
    }

    // Recurse
    const value = data[key];
    if (typeof value === 'object' && value !== null) {
      findPaths(value, term, newPath, results);
    } else {
      // Check primitive value match
      if (String(value).toLowerCase().includes(lowerTerm)) {
        results.add(newPath);
      }
    }
  });
};

const Highlight: React.FC<{ text: string; term: string }> = ({ text, term }) => {
  if (!term || !text.toLowerCase().includes(term.toLowerCase())) {
    return <span>{text}</span>;
  }
  const parts = text.split(new RegExp(`(${term})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === term.toLowerCase() ? 
        <span key={i} className="bg-yellow-200 text-slate-900 font-bold rounded-sm px-0.5">{part}</span> : 
        part
      )}
    </span>
  );
};

// Helper to get all paths for full expansion
const getAllPaths = (data: any, rootPath: string = 'root') => {
  const paths = new Set<string>();
  const traverse = (obj: any, path: string) => {
    paths.add(path);
    if (obj && typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(k => {
        traverse(obj[k], `${path}.${k}`);
      });
    }
  };
  traverse(data, rootPath);
  return paths;
};

// --- EXCEL EXPORT HELPERS ---

// Flatten nested objects to a single level.
const flattenObject = (obj: any, prefix = ''): any => {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    const val = obj[k];
    
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      // Recurse into nested objects
      Object.assign(acc, flattenObject(val, pre + k));
    } else if (Array.isArray(val)) {
       // Stringify arrays of primitives or empty arrays
       acc[pre + k] = JSON.stringify(val);
    } else {
      // Primitive values
      acc[pre + k] = val;
    }
    return acc;
  }, {});
};

const exportToExcel = (data: any) => {
  if (!data) return;

  const rows: any[] = [];

  // Recursive function to drill down into the JSON structure.
  // It finds arrays of objects (like Reports, Entries, Allocations) and creates a row for each item.
  // It merges parent context (Batch Info -> Report Info -> Entry Info) as it goes down.
  const collectRows = (node: any, context: any) => {
    // 1. Handle Array Node (Iterate and pass through)
    if (Array.isArray(node)) {
        node.forEach(item => collectRows(item, context));
        return;
    }

    // 2. Handle Object Node
    if (typeof node === 'object' && node !== null) {
        const keys = Object.keys(node);
        
        // Identify which keys are arrays of OBJECTS (these are the ones we want to drill into)
        const arrayKeys = keys.filter(k => {
            const val = node[k];
            return Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0] !== null;
        });

        // Prepare the context for this level (everything that is NOT a child array)
        const primitiveProps = { ...node };
        arrayKeys.forEach(k => delete primitiveProps[k]);
        
        const newContext = { ...context, ...primitiveProps };

        if (arrayKeys.length === 0) {
            // LEAF NODE: Create a row!
            rows.push(flattenObject(newContext));
        } else {
            // BRANCH NODE: Has children arrays. Drill down.
            arrayKeys.forEach(key => {
                const childArray = node[key];
                childArray.forEach((child: any) => {
                    collectRows(child, newContext);
                });
            });
        }
    }
  };

  // Start the recursive collection
  collectRows(data, {});

  if (rows.length === 0) return;

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Concur Data");
  XLSX.writeFile(wb, "SAP_Concur_Export.xlsx");
};

// --- END EXCEL HELPERS ---

interface JsonNodeProps {
  name: string;
  value: any;
  isLast: boolean;
  level: number;
  path: string;
  section: Section;
  expandedKeys: Set<string>;
  toggleKey: (key: string) => void;
  searchTerm: string;
  hideNulls: boolean;
}

const JsonNode: React.FC<JsonNodeProps> = ({ 
  name, value, isLast, level, path, section, expandedKeys, toggleKey, searchTerm, hideNulls
}) => {
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const isExpanded = expandedKeys.has(path);
  const nextSection = getChildSection(name, section);
  const colorClass = getSectionColor(nextSection);

  if (!isObject) {
    const valString = typeof value === 'string' ? `"${value}"` : String(value);
    const valColor = typeof value === 'string' ? 'text-green-600' : 
                     typeof value === 'number' ? 'text-blue-600' : 
                     typeof value === 'boolean' ? 'text-purple-600' : 'text-slate-500';

    return (
      <div className={`font-mono text-sm leading-6 hover:bg-black/5 px-2 rounded flex items-start`}>
        <div style={{ paddingLeft: `${level * 20}px` }} className="flex items-center">
          <span className={`mr-1 opacity-70 ${colorClass}`}>
             <Highlight text={name} term={searchTerm} />
          </span>
          <span className="text-slate-400 mr-2">:</span>
          <span className={`${valColor} break-all`}>
            <Highlight text={valString} term={searchTerm} />
          </span>
          {!isLast && <span className="text-slate-400">,</span>}
        </div>
      </div>
    );
  }

  // For Objects/Arrays
  let keys = Object.keys(value);
  
  // Filter out null values if option is enabled and it is NOT an array
  if (hideNulls && !isArray) {
    keys = keys.filter(k => value[k] !== null);
  }

  // Natural Sort for keys (so Custom1, Custom2, Custom10 appear in numeric order)
  if (!isArray) {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    keys.sort(collator.compare);
  }

  const isEmpty = keys.length === 0;

  return (
    <div className={`font-mono text-sm`}>
      <div 
        className={`flex items-center cursor-pointer hover:bg-black/5 px-2 rounded py-0.5 select-none ${isExpanded ? '' : ''}`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => toggleKey(path)}
      >
        <button className="mr-1 text-slate-400 hover:text-sap-blue transition-colors focus:outline-none">
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <span className={`font-medium ${colorClass}`}>
          <Highlight text={name} term={searchTerm} />
        </span>
        
        <span className="text-slate-400 mx-1">:</span>
        
        <span className="text-slate-500 text-xs">
          {isArray ? '[' : '{'}
          {!isExpanded && (
            <span className="mx-1 text-slate-400 italic">
               {keys.length} {keys.length === 1 ? 'item' : 'items'} 
            </span>
          )}
          {!isExpanded && (isArray ? ']' : '}')}
          {!isExpanded && !isLast && <span className="text-slate-400">,</span>}
        </span>
      </div>

      {isExpanded && !isEmpty && (
        <div className={`border-l-2 ml-4 ${section === 'report' ? 'border-blue-100' : 'border-slate-100'}`}>
          {keys.map((key, idx) => (
            <JsonNode
              key={key}
              name={key}
              value={value[key]}
              isLast={idx === keys.length - 1}
              level={level + 1}
              path={`${path}.${key}`}
              section={nextSection}
              expandedKeys={expandedKeys}
              toggleKey={toggleKey}
              searchTerm={searchTerm}
              hideNulls={hideNulls}
            />
          ))}
        </div>
      )}
      
      {isExpanded && (
        <div style={{ paddingLeft: `${level * 20}px` }} className="px-2 py-0.5 text-slate-500">
          {isArray ? ']' : '}'}
          {!isLast && <span className="text-slate-400">,</span>}
        </div>
      )}
    </div>
  );
};

const JsonViewer: React.FC<JsonViewerProps> = ({ data, mode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['root']));
  const [hideNulls, setHideNulls] = useState(false);

  // Initialize: Expand all keys when data loads
  useEffect(() => {
    if (data) {
      setExpandedKeys(getAllPaths(data));
      setSearchTerm(''); // Clear search on new data
    }
  }, [data]);

  // Handle Search
  useEffect(() => {
    if (!searchTerm.trim()) return;

    // Finding all paths that match
    const foundPaths = new Set<string>();
    findPaths(data, searchTerm, 'root', foundPaths);

    // For every match, we need to ensure all PARENT paths are expanded
    const keysToExpand = new Set<string>(expandedKeys);
    
    foundPaths.forEach(path => {
      const parts = path.split('.');
      let current = '';
      parts.forEach((part, idx) => {
        // Build path incrementally to get parents
        current = idx === 0 ? part : `${current}.${part}`;
        // If we aren't at the leaf node, expand it
        if (idx < parts.length - 1) {
            keysToExpand.add(current);
        }
      });
    });

    setExpandedKeys(keysToExpand);
  }, [searchTerm, data]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleKey = useCallback((path: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const expandAll = () => {
    setExpandedKeys(getAllPaths(data));
  };

  const collapseAll = () => {
    setExpandedKeys(new Set(['root']));
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (mode === ViewMode.RAW) {
    return (
      <div className="relative h-full overflow-auto bg-slate-50 p-4">
        <button 
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded text-slate-500 hover:text-sap-blue shadow-sm transition-all z-10"
          title="Copy JSON"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <pre className="font-mono text-xs text-slate-700 whitespace-pre-wrap break-all">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-slate-100 bg-slate-50/50">
        <div className="relative flex-1 max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search size={14} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keys or values..."
            className="w-full pl-8 pr-8 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-sap-blue focus:border-sap-blue outline-none transition-shadow"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="h-4 w-px bg-slate-300 mx-1"></div>

        <button 
          onClick={() => exportToExcel(data)}
          className="p-1.5 text-slate-500 hover:text-green-600 hover:bg-white rounded transition-colors flex items-center gap-1"
          title="Export to Excel"
        >
          <FileSpreadsheet size={16} />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1"></div>

        <button 
          onClick={() => setHideNulls(!hideNulls)}
          className={`p-1.5 rounded transition-colors ${hideNulls ? 'bg-blue-100 text-sap-blue' : 'text-slate-500 hover:text-sap-blue hover:bg-white'}`}
          title={hideNulls ? "Show Null Values" : "Hide Null Values"}
        >
          <Filter size={16} />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1"></div>

        <button 
          onClick={expandAll}
          className="p-1.5 text-slate-500 hover:text-sap-blue hover:bg-white rounded transition-colors"
          title="Expand All"
        >
          <PlusSquare size={16} />
        </button>
        <button 
          onClick={collapseAll}
          className="p-1.5 text-slate-500 hover:text-sap-blue hover:bg-white rounded transition-colors"
          title="Collapse All"
        >
          <MinusSquare size={16} />
        </button>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <JsonNode 
          name="root" 
          value={data} 
          isLast={true} 
          level={0} 
          path="root" 
          section="root"
          expandedKeys={expandedKeys}
          toggleKey={toggleKey}
          searchTerm={searchTerm}
          hideNulls={hideNulls}
        />
      </div>
    </div>
  );
};

export default JsonViewer;