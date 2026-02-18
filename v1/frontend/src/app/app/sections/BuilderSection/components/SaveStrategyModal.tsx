"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box, Typography } from "@mui/material";
import { Save, X } from "lucide-react";

interface SaveStrategyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

export function SaveStrategyModal({ open, onClose, onSave }: SaveStrategyModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, description);
    onClose();
    setName("");
    setDescription("");
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: '#0a0f1e',
          border: '2px solid #374151',
          borderRadius: 0,
          minWidth: '400px',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }
      }}
    >
      <DialogTitle className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2">
          <Save size={20} className="text-emerald-400" />
          <Typography className="font-pixel text-white text-lg tracking-wider">
            SAVE STRATEGY
          </Typography>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </DialogTitle>

      <DialogContent className="pt-6">
        <Box className="flex flex-col gap-4 mt-4">
          <div className="space-y-2">
            <label className="font-mono text-xs text-gray-400 uppercase tracking-wider">
              Strategy Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Strategy"
              className="w-full bg-black border border-gray-700 p-3 text-white font-mono text-sm focus:border-emerald-500 outline-none transition-colors"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-xs text-gray-400 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this strategy does..."
              rows={3}
              className="w-full bg-black border border-gray-700 p-3 text-white font-mono text-sm focus:border-emerald-500 outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={onClose}
              sx={{
                fontFamily: 'monospace',
                color: '#9ca3af',
                '&:hover': { color: 'white' }
              }}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim()}
              sx={{
                fontFamily: 'monospace',
                backgroundColor: '#064e3b',
                color: 'white',
                border: '1px solid #10b981',
                padding: '8px 24px',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: '#065f46',
                },
                '&:disabled': {
                  backgroundColor: '#1f2937',
                  borderColor: '#374151',
                  color: '#6b7280'
                }
              }}
            >
              SAVE
            </Button>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
