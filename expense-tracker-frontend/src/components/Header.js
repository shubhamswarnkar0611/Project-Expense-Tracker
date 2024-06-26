import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  usePurchaseMembershipMutation,
  useUpdateOrderMutation,
} from "../services/api";
import { FaUser } from "react-icons/fa";
import { AppContext } from "../context/appContext";
import SideBar from "./SideBar";
import Menu from "./Menu";

const Header = () => {
  const navigate = useNavigate();
  const { user, userToken, setIsOpenSideBar, isOpenSideBar } =
    useContext(AppContext);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [member, setMember] = useState(user.isPremium);
  const [purchaseMembership, { isLoading }] = usePurchaseMembershipMutation();
  const [updateOrder] = useUpdateOrderMutation();

  useEffect(() => {
    let timeoutId;
  
    // Check if the user is not a premium member
    if (!member) {
      // Create a toast after 10 seconds
      timeoutId = setTimeout(() => {
        toast.custom((t) => (
          <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5 text-#A6C1C7">
                  <p>Buy</p>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-md font-medium text-gray-100">Be a Premium Member</p>
                  <p className="mt-1 text-sm text-gray-400">Unlock LeaderBoard</p>
                  <p className="mt-1 text-sm text-gray-400">You Don't Have To Pay For Real Its On Test Mode</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button onClick={() => toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Close
              </button>
            </div>
          </div>
        ), {
          position: "bottom-right"
        });
      }, 15000);
    }
  
    // Clean up interval to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setMember(user.isPremium);
  }, [setMember, navigate, user]);

 

  async function handleBuyingMembership(e) {
    e.preventDefault();
    try {
      const Response = await purchaseMembership({ userToken });

      const options = {
        key: Response.data.keyId,
        orderId: Response.data.orderDetails.id,
        amount: Response.data.amount,
        handler: async function (response) {
          const result = await updateOrder({
            userToken,
            orderId: options.orderId,
            paymentId: response.razorpay_payment_id,
          });
          toast.success("Payment Successful!");
          setMember(true);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Error during membership purchase:", error);
    }
  }
  function handleOpenMenu() {
    setIsOpenMenu(!isOpenMenu);
  }

  return (
    <>
      <nav className="sm:px-4 p-4  sm:ml-64 sticky md:relative shadow-md sm:shadow-none   top-0  bg-white md:bg-transparent bg-opacity-90 rounded-ee-full h-20  mb-4 ">
        <div className="  flex justify-between ">
          <div className="flex items-center">
            <button
              data-drawer-target="logo-sidebar"
              data-drawer-toggle="logo-sidebar"
              aria-controls="logo-sidebar"
              type="button"
              className="inline-flex items-center mx-2  ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200   "
              onClick={() => {
                setIsOpenSideBar(!isOpenSideBar);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <p className="text-lg mx-5 font-semibold text-#1E5D69">
              Hey, {user.name}!
            </p>
          </div>

          <div className="mx-5 mt-1 flex">
            <Toaster />
            {member ? (
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-gradient-to-br from-red-500 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Pro User
                </span>
              </button>
            ) : (
              <button
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                onClick={handleBuyingMembership}
              >
                <span className="relative px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  {isLoading ? <p>Loading...</p> : <p>Buy Membership</p>}
                </span>
              </button>
            )}
            <div className="mx-4 hidden md:flex">
              <span className="self-center pb-2 text-xl flex m font-semibold whitespace-nowrap dark:text-white hover:text-orange-400">
                <button onClick={handleOpenMenu}>
                  <FaUser className="m-1 text-#6952F1 hover:shadow-md hover:text-indigo-800" />
                </button>
              </span>
            </div>
          </div>
        </div>
      </nav>
      {isOpenMenu ? (
        <Menu setIsOpenMenu={setIsOpenMenu} userDetails={user} />
      ) : null}
    </>
  );
};

export default Header;
