import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, DollarSign, TrendingUp, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from "../contexts/AuthContext.jsx"
import { useEffect } from 'react';
import UpdateTransactionModal from '../components/upDatepop.jsx';
import axios from '..utils/axios';
export default function DashboardPage() {
  // for the model of update pop
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [load, setload] = useState(false);
  // 

  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [borrowers, setBorrowers] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setdeleteTargetId] = useState(null);
  const stats = {
    totalLent: borrowers.reduce((sum, b) => sum + (b.totalBorrowed || 0), 0),
    totalReceived: borrowers.reduce((sum, b) => sum + (b.totalPaid || 0), 0),
    totalPending: borrowers.reduce((sum, b) => sum + (b.totalDue || 0), 0),
    activeBorrowers: borrowers.filter(b => b.status === 'active').length,
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    const matchesSearch =
      borrower.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.borrowerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || borrower.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const fetchBorrowers = async () => {
    try {
      setload(true);
      const res = await axios.get(`https://udhaar-project.onrender.com/api/borrowers`, {
        withCredentials: true, // important to include cookies
      });
      setBorrowers(res.data);
    } catch (err) {
      console.error("Error fetching borrowers:", err);
    }
    finally {
      setload(false);
    }
  };
  useEffect(() => {
    if (!user?.id) return;
    fetchBorrowers();
  }, [user?.id]);

  const handleDeleteBorrower = async () => {
    try {
      setShowConfirmModal(false);
      setload(true);

      // const confirmDelete = window.confirm("Are you sure you want to delete this borrower?");
      // if (!confirmDelete) return;
      await toast.promise(
        axios.delete(`https://udhaar-project.onrender.com/api/borrowers/${deleteTargetId}/delete`, {
          withCredentials: true,
        }),
        {
          loading: "Deleting borrower...",
          success: "Borrower deleted successfully!",
          error: "Failed to delete borrower.",
        }
      );
      setBorrowers(prev => prev.filter(borrower => borrower._id !== deleteTargetId));

    } catch (err) {
      console.error("Delete borrower error:", err);
      toast.error("Failed to delete borrower.");
    }
    finally {
      setload(false);
      setdeleteTargetId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your lending and borrowing records</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {['Total Lent', 'Total Received', 'Pending', 'Active Borrowers'].map((label, i) => {
            const values = [stats.totalLent, stats.totalReceived, stats.totalPending, stats.activeBorrowers];
            const icons = [<DollarSign />, <TrendingUp />, <Clock />, <Users />];
            const colors = [
              'bg-[#960018] bg-opacity-10 text-[#960018]',
              'bg-green-100 text-green-600',
              'bg-orange-100 text-orange-600',
              'bg-blue-100 text-blue-600',
            ];
            return (
              <div key={label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className={`p-2 ${colors[i].split(' ')[0]} rounded-lg`}>
                    {React.cloneElement(icons[i], { className: `w-6 h-6 ${colors[i].split(' ')[1]}` })}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {i < 3 ? `₹${values[i].toLocaleString()}` : values[i]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search borrowers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#960018] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#960018] focus:border-transparent appearance-none bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <Link className="bg-[#960018] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#7a0013] transition-colors flex items-center space-x-2" to="/new-borrower">
              <Plus className="w-5 h-5" />
              <span>Add Borrower</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBorrowers.length > 0 ? (
            filteredBorrowers.map((borrower, index) => (
              <motion.div
                key={borrower._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
                        {borrower.borrowerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{borrower.borrowerName}</h3>
                      <p className="text-sm text-gray-600">{borrower.borrowerEmail}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(borrower.status)}`}>
                    {borrower.status.charAt(0).toUpperCase() + borrower.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Borrowed:</span>
                    <span className="text-sm font-semibold">₹{borrower.totalBorrowed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Paid:</span>
                    <span className="text-sm font-semibold text-green-600">₹{borrower.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount Due:</span>
                    <span className="text-sm font-semibold text-red-600">₹{borrower.totalDue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      to={`/records/${borrower._id}`}
                      className="w-full bg-[#960018] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7a0013] transition-colors text-center block"
                    >
                      View
                    </Link>

                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    {/* <button
                    className="w-full bg-[#960018] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7a0013] transition-colors text-center block"
                  >
                   Update
                  </button> */}
                    <button className="w-full bg-[#960018] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7a0013] transition-colors text-center block"
                      onClick={() => {
                        setSelectedBorrower(borrower);
                        setIsUpdateOpen(true);
                      }}>Update</button>
                  </div>
                </div>
                {borrower.totalDue == 0 ?
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setdeleteTargetId(borrower._id);
                        setShowConfirmModal(true);
                      }}
                      className="w-full  bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7a0013] transition-colors text-center block"
                    >
                      delete
                    </button>

                  </div>
                  :
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setdeleteTargetId(borrower._id);
                        setShowConfirmModal(true);
                      }}
                      className="w-full bg-[#960018] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#7a0013] transition-colors text-center block"
                    >
                      delete
                    </button>

                  </div>
                }

              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No borrowers found</h3>
              <p className="text-gray-600 mb-6">Start by adding your first borrower to track lending records.</p>
              <Link className=" bg-[#960018] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#7a0013] transition-colors " to="/new-borrower">
                <span>Add First Borrower</span>
              </Link>
            </div>
          )}
        </motion.div>
        <UpdateTransactionModal
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          borrower={selectedBorrower}
          refresh={fetchBorrowers} // optional refetch method
        />
      </div>
      {/* import { AnimatePresence, motion } from "framer-motion"; */}

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            key="backdrop"
            id="backdrop"
            onClick={(e) => e.target.id === "backdrop" && setShowConfirmModal(false)}
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key="modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-xl space-y-4 w-72 text-center border-2 border-gray-400"
            >
              <p className="text-lg font-semibold text-gray-800">Are you sure to Delete borrower?</p>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBorrower}
                  className="px-4 py-2 text-sm bg-[#960018] text-white rounded hover:bg-[#7a0013]"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {load && (
        <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-4 border-[#960018] border-t-transparent rounded-full animate-spin pointer-events-auto"></div>
        </div>
      )}
    </div>

  );
}

