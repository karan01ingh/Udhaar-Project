import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, DollarSign, Check, X, Calendar, Plus } from 'lucide-react';

export default function RecordsPage() {
  const { borrowerId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [borrower, setBorrower] = useState(null);
  const [loading, setLoading] = useState(true);
  const [load,setload]=useState(false);
  useEffect(() => {
  const fetchData = async () => {
    setload(true);
    try {
      const [transactionsRes, borrowerRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/transactions/${borrowerId}`, {
          withCredentials: true,
        }),
        axios.get(`http://localhost:3001/api/borrowers/${borrowerId}/get`, {
          withCredentials: true,
        }),
      ]);
      // console.log(borrowerRes.data);
      setTransactions(transactionsRes.data);
      setBorrower(borrowerRes.data);
    } catch (err) {
      console.error('Error loading borrower data:', err);
      toast.error('Failed to load borrower or transactions');
    } finally {
      // setLoading(false);
      setload(false);
    }
  };

  if (borrowerId) fetchData();
}, [borrowerId]);


  // if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!borrower) return <div className="text-center mt-10 text-red-500">Borrower not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center space-x-2 text-[#960018] hover:text-[#7a0013] mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-xl">
                  {borrower.borrowerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{borrower.borrowerName}</h1>
                <p className="text-gray-600">{borrower.borrowerEmail}</p>
                <p className="text-gray-600">{borrower.borrowerPhone}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <SummaryCard icon={<DollarSign className="w-6 h-6 text-red-600" />} bg="bg-red-100" title="Total Borrowed" amount={borrower.totalBorrowed} />
          <SummaryCard icon={<Check className="w-6 h-6 text-green-600" />} bg="bg-green-100" title="Total Paid" amount={borrower.totalPaid} />
          <SummaryCard icon={<X className="w-6 h-6 text-orange-600" />} bg="bg-orange-100" title="Amount Due" amount={borrower.totalDue} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          </div>

          <div className="p-6">
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((tx, index) => (
                  <motion.div
                    key={tx._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${tx.type === 'borrow' ? 'bg-red-100' : 'bg-green-100'}`}>
                          {tx.type === 'borrow' ? (
                            <DollarSign className="w-5 h-5 text-red-600" />
                          ) : (
                            <Check className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.description || tx.type}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(tx.date).toLocaleDateString()}</span>
                            </span>
                            <span className={`font-semibold ${tx.type === 'borrow' ? 'text-red-600' : 'text-green-600'}`}>
                              {tx.type === 'borrow' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-600 mb-6">Start by adding the first transaction for this borrower.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
{load && (
        <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-4 border-[#960018] border-t-transparent rounded-full animate-spin pointer-events-auto"></div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, title, amount, bg }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${bg}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">₹{amount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}