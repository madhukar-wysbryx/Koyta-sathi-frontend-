import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { Modal } from '../../components/UI/Modal';
import { Input } from '../../components/UI/Input';
import { Button } from '../../components/UI/Button';
import { Loader } from '../../components/UI/Loader';
import { ledgerApi } from '../../api/ledger.api';

interface Transaction {
  id: string;
  type: 'taken' | 'repaid';
  amount: number;
  purpose: string;
  date: string;
  remainingBalance: number;
  visualPercentage: number;
}

export const Ledger: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'taken' | 'repaid'>('taken');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadLedger(); }, []);

  const loadLedger = async () => {
    try {
      const data = await ledgerApi.getLedger();
      setTransactions(data.transactions);
      setSummary(data.summary);
      const w = await ledgerApi.getWarnings();
      setWarning(w?.message || null);
    } catch (error) {
      console.error('Failed to load ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setSubmitting(true);
    try {
      await ledgerApi.addTransaction({
        type: modalType,
        amount: parseFloat(amount),
        purpose: purpose || (modalType === 'taken' ? 'General advance' : 'Repayment'),
        date,
      });
      setShowModal(false);
      setAmount('');
      setPurpose('');
      setDate(new Date().toISOString().split('T')[0]);
      loadLedger();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout title="Ledger" showBack><Loader /></Layout>;

  return (
    <Layout title="Ledger" showBack>
      {/* Overspending warning */}
      {warning && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-red-700">Spending Warning</p>
            <p className="text-sm text-red-600">{warning}</p>
          </div>
        </div>
      )}

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Taken',  value: summary.totalAdvance, color: 'text-red-600' },
            { label: 'Total Repaid', value: summary.totalRepaid,  color: 'text-green-600' },
            { label: 'Remaining',    value: summary.remaining,    color: 'text-gray-800' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>₹{(value || 0).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {summary && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <ProgressBar percentage={summary.visualPercentage} label="Repayment Progress" color="green" />
          {summary.priorityAdvance > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <ProgressBar
                percentage={Math.min((summary.totalAdvance / summary.priorityAdvance) * 100, 100)}
                label="Priority Advance Used"
                color={summary.totalAdvance >= summary.priorityAdvance ? 'red' : 'green'}
              />
              <p className="text-xs text-gray-400 mt-1">
                ₹{(summary.totalAdvance || 0).toLocaleString()} of ₹{summary.priorityAdvance.toLocaleString()} priority advance used
              </p>
            </div>
          )}
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">Transaction History</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <span>+</span> Add Entry
        </button>
      </div>

      {/* Desktop table / Mobile cards */}
      {transactions.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-100 shadow-sm">
          <p className="text-4xl mb-3">📒</p>
          <p className="text-gray-500">No transactions yet. Add your first entry.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Purpose</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === 'taken' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {tx.type === 'taken' ? '↓ Taken' : '↑ Repaid'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{tx.purpose}</td>
                    <td className={`px-5 py-3 text-right font-semibold ${tx.type === 'taken' ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.type === 'taken' ? '−' : '+'}₹{tx.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500">₹{tx.remainingBalance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${
                      tx.type === 'taken' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {tx.type === 'taken' ? '↓ Taken' : '↑ Repaid'}
                    </span>
                    <p className="text-sm text-gray-700">{tx.purpose}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                  <p className={`text-lg font-bold ${tx.type === 'taken' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.type === 'taken' ? '−' : '+'}₹{tx.amount.toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-50 text-xs text-gray-400 flex justify-between">
                  <span>Balance: ₹{tx.remainingBalance.toLocaleString()}</span>
                  <span>{tx.visualPercentage}% of plan</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setShowModal(true)}
        className="md:hidden fixed bottom-20 right-4 bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-green-700 transition z-20"
      >
        +
      </button>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Transaction">
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${modalType === 'taken' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setModalType('taken')}
            >📥 Advance Taken</button>
            <button
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${modalType === 'repaid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setModalType('repaid')}
            >📤 Repaid</button>
          </div>
          <Input label="Amount (₹)" type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input label="Purpose (Optional)" placeholder={modalType === 'taken' ? 'What is this for?' : 'Repayment reference'} value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">You can log past installments by selecting an earlier date.</p>
          </div>
          <Button onClick={handleAddTransaction} loading={submitting} fullWidth>Add to Ledger</Button>
        </div>
      </Modal>
    </Layout>
  );
};
