import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout, {
  StatCard,
  TabGroup,
  ListRow,
} from "../components/ui/DashboardLayout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";

const TABS = [
  { id: "add", label: "Add Product" },
  { id: "orders", label: "My Orders" },
  { id: "earnings", label: "Earnings" },
  { id: "payout", label: "Payout Details" },
];

function Seller() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("add");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    transferredEarnings: 0,
    pendingEarnings: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  const [upiId, setUpiId] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [payoutMsg, setPayoutMsg] = useState("");
  const [payoutError, setPayoutError] = useState("");

  const seller = JSON.parse(localStorage.getItem("seller") || "{}");

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "earnings") {
      fetchOrders();
      fetchEarnings();
    }
    if (activeTab === "payout") loadPayoutDetails();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get("http://localhost:3000/seller/orders", {
        withCredentials: true,
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchEarnings = async () => {
    setLoadingEarnings(true);
    try {
      const res = await axios.get("http://localhost:3000/seller/earnings", {
        withCredentials: true,
      });
      setEarnings({
        totalEarnings: res.data.totalEarnings || 0,
        transferredEarnings: res.data.transferredEarnings || 0,
        pendingEarnings: res.data.pendingEarnings || 0,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingEarnings(false);
    }
  };

  const loadPayoutDetails = () => {
    if (seller.upiId) setUpiId(seller.upiId);
    if (seller.bankAccount) setBankAccount(seller.bankAccount);
    if (seller.ifscCode) setIfscCode(seller.ifscCode);
    if (seller.accountHolderName) setAccountHolderName(seller.accountHolderName);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !price || !image || !info) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/addproduct",
        { name, price, image, info },
        { withCredentials: true }
      );
      if (res.data.success) {
        setSuccess("Product added successfully!");
        setName("");
        setPrice("");
        setImage("");
        setInfo("");
      } else {
        setError(res.data.message || "Failed to add product");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  const handleSavePayoutDetails = async (e) => {
    e.preventDefault();
    setPayoutMsg("");
    setPayoutError("");
    try {
      const res = await axios.post(
        "http://localhost:3000/seller/payout-details",
        { upiId, bankAccount, ifscCode, accountHolderName },
        { withCredentials: true }
      );
      if (res.data.success) {
        setPayoutMsg("Payout details saved successfully!");
        const updatedSeller = {
          ...seller,
          upiId,
          bankAccount,
          ifscCode,
          accountHolderName,
        };
        localStorage.setItem("seller", JSON.stringify(updatedSeller));
      } else {
        setPayoutError(res.data.message || "Failed to save payout details");
      }
    } catch (err) {
      setPayoutError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("seller");
    navigate("/sellerlogin");
  };

  return (
    <DashboardLayout
      title="Seller Dashboard"
      userLabel={seller.email || "Seller"}
      onLogout={handleLogout}
    >
      <Card className="mb-8" padding="p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Welcome back, {seller.name || "Seller"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage products, track orders, and update payout details.
        </p>
      </Card>

      <TabGroup tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "add" && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Add new product</h2>
          <form onSubmit={handleAddProduct} className="mt-6 max-w-xl space-y-4">
            {error && <Alert variant="error">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Price (INR)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              type="url"
              placeholder="Image URL"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
            <Textarea
              placeholder="Product description"
              rows={4}
              value={info}
              onChange={(e) => setInfo(e.target.value)}
              required
            />
            <Button type="submit" size="lg">
              Add product
            </Button>
          </form>
        </Card>
      )}

      {activeTab === "orders" && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            My orders{" "}
            <span className="font-normal text-slate-500">({orders.length})</span>
          </h2>
          {loadingOrders ? (
            <Spinner label="Loading orders..." />
          ) : orders.length === 0 ? (
            <p className="mt-6 text-center text-sm text-slate-500">
              No orders yet. Purchases will appear here once customers buy your
              products.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <ListRow key={order._id}>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">
                      {order.productId?.name || "Product"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Buyer: {order.userId?.name || "Unknown"} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-1 truncate font-mono text-xs text-slate-400">
                      {order.paymentId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ₹{order.amount}
                    </p>
                    <Badge
                      variant={
                        order.paymentStatus === "successful"
                          ? "success"
                          : "warning"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </ListRow>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === "earnings" && (
        <div className="space-y-6">
          {loadingEarnings ? (
            <Spinner label="Calculating earnings..." />
          ) : (
            <div className="flex flex-wrap gap-4">
              <StatCard
                label="Total earnings"
                value={`₹${earnings.totalEarnings}`}
              />
              <StatCard
                label="Pending payout"
                value={`₹${earnings.pendingEarnings}`}
                accent="text-amber-600"
              />
              <StatCard
                label="Transferred"
                value={`₹${earnings.transferredEarnings}`}
                accent="text-emerald-600"
              />
            </div>
          )}

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">
              Order breakdown
            </h2>
            {orders.length === 0 ? (
              <p className="mt-6 text-center text-sm text-slate-500">
                No orders yet
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <ListRow key={order._id}>
                    <div>
                      <p className="font-medium text-slate-900">
                        {order.productId?.name || "Product"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      ₹{order.amount}
                    </p>
                  </ListRow>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === "payout" && (
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">
            Bank / UPI payout details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Admin uses these details to transfer your earnings manually.
          </p>

          <form
            onSubmit={handleSavePayoutDetails}
            className="mt-6 max-w-xl space-y-4"
          >
            {payoutMsg && <Alert variant="success">{payoutMsg}</Alert>}
            {payoutError && <Alert variant="error">{payoutError}</Alert>}

            <Input
              label="UPI ID"
              type="text"
              placeholder="seller@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <Input
              label="Account holder name"
              type="text"
              placeholder="Full name on bank account"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
            />
            <Input
              label="Bank account number"
              type="text"
              placeholder="Account number"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
            <Input
              label="IFSC code"
              type="text"
              placeholder="HDFC0001234"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
            />

            <Button type="submit" size="lg">
              Save payout details
            </Button>
          </form>
        </Card>
      )}
    </DashboardLayout>
  );
}

export default Seller;
