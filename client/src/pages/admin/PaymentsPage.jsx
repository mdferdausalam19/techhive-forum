import React, { useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import { FiDollarSign, FiSearch, FiUser } from "react-icons/fi";
import useAxiosCommon from "../../hooks/useAxiosCommon";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const axiosCommon = useAxiosCommon();

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin-payments-all"],
    queryFn: async () => {
      const { data } = await axiosCommon.get(`/admin/payments`);
      return data;
    },
  });

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: "bg-green-100 text-green-800", text: "Completed" },
      pending: { bg: "bg-yellow-100 text-yellow-800", text: "Pending" },
      failed: { bg: "bg-red-100 text-red-800", text: "Failed" },
      refunded: { bg: "bg-blue-100 text-blue-800", text: "Refunded" },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100 text-gray-800",
      text: status,
    };

    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}
      >
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (paymentsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payment Management"
        description="View and manage all payment transactions"
        icon={FiDollarSign}
      />

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <AdminTable
        headers={[
          { key: "transaction", label: "Transaction" },
          { key: "user", label: "User" },
          { key: "details", label: "Payment Details" },
          { key: "card", label: "Card Details" },
          { key: "status", label: "Status" },
        ]}
        data={filteredPayments}
        keyField="id"
        emptyMessage="No payments found matching your criteria"
        showActions={false}
        renderRow={(payment) => (
          <>
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900">
                {"PMT-" + payment.transactionId.slice(0, 6)}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(payment.date).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <FiUser className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.user.email}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900 font-medium">
                {formatCurrency(payment.amount)}
              </div>
              <div className="text-sm text-gray-500">{payment.plan}</div>
              <div className="text-xs text-gray-500 mt-1">
                {payment.transactionId}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <div className="text-sm font-medium text-gray-900">
                  {payment.cardName}
                </div>
                <div className="text-sm text-gray-500">
                  {payment.cardType} card
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="mb-2">{getStatusBadge(payment.status)}</div>
            </td>
          </>
        )}
      />
    </div>
  );
}
