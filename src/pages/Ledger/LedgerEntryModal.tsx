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
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    await onSave('taken', parseFloat(amount), purpose);
    setLoading(false);
    setAmount('');
    setPurpose('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <div className="space-y-4">
        <Input
          label="Amount (₹)"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Input
          label="Purpose (Optional)"
          placeholder="What is this for?"
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