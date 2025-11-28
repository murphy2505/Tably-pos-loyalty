import { useEffect, useState } from "react";
import type { Customer, Wallet, HistoryEvent } from "../../types/customers";
import { CustomersList } from "../../components/customers/CustomersList";
import { CustomerDetailPanel } from "../../components/customers/CustomerDetailPanel";
import { getCustomers, getCustomerDetail } from "../../services/loyaltyApi";

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [detailCustomer, setDetailCustomer] = useState<Customer | undefined>(undefined);
  const [detailWallets, setDetailWallets] = useState<Wallet[] | undefined>(undefined);
  const [detailHistory, setDetailHistory] = useState<HistoryEvent[] | undefined>(undefined);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setLoadingList(true);
      setError(undefined);
      try {
        const data = await getCustomers();
        setCustomers(data);
        if (data.length > 0) {
          setSelectedCustomerId(data[0].id);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) {
      setDetailCustomer(undefined);
      setDetailWallets(undefined);
      setDetailHistory(undefined);
      return;
    }
    (async () => {
      setLoadingDetail(true);
      setError(undefined);
      try {
        const detail = await getCustomerDetail(selectedCustomerId);
        setDetailCustomer(detail.customer);
        setDetailWallets(detail.wallets);
        setDetailHistory(detail.history);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingDetail(false);
      }
    })();
  }, [selectedCustomerId]);

  return (
    <div style={{ height: "100%", display: "flex" }}>
      <div style={{ width: 300, background: "#fff" }}>
        {loadingList && customers.length === 0 ? (
          <div style={{ padding: 12, fontSize: 12 }}>Laden...</div>
        ) : (
          <CustomersList
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={setSelectedCustomerId}
          />
        )}
      </div>
      <div style={{ flex: 1, background: "#fff" }}>
        {error && (
          <div style={{ padding: 12, fontSize: 12, color: "#b00" }}>Error: {error}</div>
        )}
        {loadingDetail && !detailCustomer ? (
          <div style={{ padding: 12, fontSize: 12 }}>Detail laden...</div>
        ) : (
          <CustomerDetailPanel
            customer={detailCustomer}
            wallets={detailWallets}
            history={detailHistory}
          />
        )}
      </div>
    </div>
  );
}
