const fs = require('fs');
const file = 'src/context/AuthContext.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "export const AuthContext = createContext<AuthContextType | undefined>(undefined);",
  "const ctxId = Math.random(); console.log('[AuthContext] MODULE LOADED, id:', ctxId); export const AuthContext = createContext<AuthContextType | undefined>(undefined);"
);
content = content.replace(
  "export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {",
  "export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => { console.log('[AuthContext] AuthProvider rendered, ctxId:', ctxId);"
);
content = content.replace(
  "const context = useContext(AuthContext);",
  "const context = useContext(AuthContext); console.log('[AuthContext] useAuth called, ctxId:', ctxId, 'context:', context ? 'defined' : 'undefined');"
);
fs.writeFileSync(file, content);
