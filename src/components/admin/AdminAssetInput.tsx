import React, { useRef, useState } from 'react';
import { Loader2, Upload, Link as LinkIcon } from 'lucide-react';
import { getSupabaseClient } from '../../lib/supabaseClient';

type Props = {
  value: string;
  onChange: (value: string) => void;
  accept: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
};

export const AdminAssetInput: React.FC<Props> = ({
  value,
  onChange,
  accept,
  label = 'Arquivo',
  hint = 'Envie um arquivo ou informe um link externo.',
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const { data } = await (await getSupabaseClient()).auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Sessão expirada. Entre novamente.');

      const form = new FormData();
      form.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Falha ao enviar arquivo.');
      onChange(payload.url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Falha ao enviar arquivo.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-stone-700">{label}</label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={disabled || uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
          className="min-w-0 flex-1 rounded-lg border border-stone-300 bg-stone-50 p-2 text-xs"
        />
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? 'Enviando' : 'Upload'}
        </button>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <LinkIcon className="h-3 w-3 text-stone-400" />
        <input
          type="url"
          value={value}
          disabled={disabled || uploading}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ou cole um link externo: https://..."
          className="w-full rounded-lg border border-stone-300 bg-stone-50 p-2 text-xs"
        />
      </div>
      <p className="mt-1 text-[11px] text-stone-400">{hint}</p>
    </div>
  );
};
