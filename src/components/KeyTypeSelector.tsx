import { Key, Hash, Lock, Code, Shield, Cpu, Terminal } from 'lucide-react';

export type KeyType = 'secret' | 'base64' | 'ssl' | 'api' | 'jwt' | 'encryption' | 'ssh';

interface KeyTypeSelectorProps {
  selectedType: KeyType;
  onSelect: (type: KeyType) => void;
}

const keyTypes = [
  { id: 'secret' as KeyType, label: 'Secret Key', icon: Key },
  { id: 'base64' as KeyType, label: 'Base64', icon: Hash },
  { id: 'ssl' as KeyType, label: 'SSL/TLS', icon: Lock },
  { id: 'api' as KeyType, label: 'API Key', icon: Code },
  { id: 'jwt' as KeyType, label: 'JWT Secret', icon: Shield },
  { id: 'encryption' as KeyType, label: 'Encryption', icon: Cpu },
  { id: 'ssh' as KeyType, label: 'SSH Key', icon: Terminal },
];

export default function KeyTypeSelector({ selectedType, onSelect }: KeyTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {keyTypes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`
            p-4 border transition-all duration-200
            ${selectedType === id
              ? 'bg-green-500/10 border-green-500 text-green-500'
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
            }
          `}
        >
          <Icon className="w-6 h-6 mx-auto mb-2" strokeWidth={1.5} />
          <div className="text-sm font-medium">{label}</div>
        </button>
      ))}
    </div>
  );
}
