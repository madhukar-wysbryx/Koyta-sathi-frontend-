import React, { useState } from 'react';
import { Modal } from '../../components/UI/Modal';
import { Input } from '../../components/UI/Input';
import { Button } from '../../components/UI/Button';

interface LedgerEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: 'taken' | 'repaid', amount: number, purpose: string) => void;
}

export const LedgerEntryModal: React.FC<LedgerEntryModalProps> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<'taken' | 'repaid'>('taken');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    await onSave(type, parseFloat(amount), purpose);
    setLoading(false);
    setAmount('');
    setPurpose('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            className={`flex-1 py-2 rounded-lg font-medium ${type === 'taken' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setType('taken')}
          >
            📥 Advance Taken
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-medium ${type === 'repaid' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
            onClick={() => setType('repaid')}
          >
            📤 Repaid
          </button>
        </div>

        <Input
          label="Amount (₹)"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Input
          label="Purpose (Optional)"
          placeholder={type === 'taken' ? 'What is this for?' : 'Repayment reference'}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        />

        <Button onClick={handleSave} loading={loading} fullWidth>
          Add to Ledger
        </Button>
      </div>
    </Modal>
  );
};