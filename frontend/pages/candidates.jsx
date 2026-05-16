import React, { useEffect, useState } from "react";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

const Candidates = () => {

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  // ===================================
  // MOUNT CHECK
  // ===================================
  useEffect(() => {
    setMounted(true);
  }, []);

  // ===================================
  // CHECK TOKEN
  // ===================================
  const checkTokenExpiry = () => {

    if (typeof window === "undefined")
      return false;

    const token =
      localStorage.getItem("token");

    if (!token) return false;

    try {

      const decoded = jwtDecode(token);

      const now = Date.now() / 1000;

      return decoded.exp > now;

    } catch (error) {

      return false;
    }
  };

  // ===================================
  // GET USER FROM TOKEN
  // ===================================
  const getUserFromToken = () => {

    if (typeof window === "undefined")
      return null;

    const token =
      localStorage.getItem("token");

    if (!token) return null;

    try {

      return jwtDecode(token);

    } catch (error) {

      return null;
    }
  };

  // ===================================
  // FETCH CANDIDATES
  // ===================================
  useEffect(() => {

    const fetchCandidate = async () => {

      try {

        const response = await fetch(
          `${API_BASE}/candidate/candidates`
        );

        const data =
          await response.json();

        console.log(
          "Candidate API Response:",
          data
        );

        // SAFE ARRAY HANDLING
        if (Array.isArray(data)) {

          setCandidates(data);

        } else if (
          Array.isArray(data.response)
        ) {

          setCandidates(data.response);

        } else {

          setCandidates([]);
        }

      } catch (error) {

        console.error(
          "Error fetching candidate:",
          error
        );

        setCandidates([]);

      } finally {

        setLoading(false);
      }
    };

    fetchCandidate();

  }, [API_BASE]);

  // ===================================
  // CAST VOTE
  // ===================================
  const voteCast = async (id) => {

    const currentToken =
      localStorage.getItem("token");

    if (!checkTokenExpiry()) {

      alert(
        "Please login again. Session expired."
      );

      router.push("/login");

      return;
    }

    try {

      const res = await fetch(
        `${API_BASE}/candidate/vote/${id}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${currentToken}`,
          },
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.error ||
          data.message ||
          "Voting failed"
        );

      } else {

        alert(
          "Vote cast successfully!"
        );

        window.location.reload();
      }

    } catch (error) {

      console.error(
        "Vote error:",
        error
      );

      alert(
        "An error occurred while voting."
      );
    }
  };

  // ===================================
  // DELETE CANDIDATE
  // ===================================
  const deleteCandidate = async (id) => {

    const currentToken =
      localStorage.getItem("token");

    if (!checkTokenExpiry())
      return;

    try {

      const res = await fetch(
        `${API_BASE}/candidate/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${currentToken}`,
          },
        }
      );

      if (res.ok) {

        alert(
          "Candidate deleted successfully!"
        );

        setCandidates((prev) =>
          prev.filter(
            (c) => c._id !== id
          )
        );

      } else {

        const data =
          await res.json();

        alert(
          data.error ||
          "Delete failed."
        );
      }

    } catch (error) {

      alert(
        "An error occurred while deleting."
      );
    }
  };

  // ===================================
  // VOTE BUTTON
  // ===================================
  const Vote = ({ id }) => {

    const [user, setUser] =
      useState(null);

    const [isLoggedIn,
      setIsLoggedIn] =
      useState(false);

    useEffect(() => {

      const isValid =
        checkTokenExpiry();

      setIsLoggedIn(isValid);

      if (isValid) {

        setUser(
          getUserFromToken()
        );
      }

    }, []);

    if (!mounted)
      return null;

    if (!isLoggedIn) {

      return (
        <div className="relative group inline-block">

          <button
            disabled
            className="py-2 px-3 rounded-md bg-gray-600 text-white cursor-not-allowed"
          >
            Vote
          </button>

          <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 text-xs transition-opacity duration-300 bg-gray-800 text-white p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible">
            Login Required to cast vote.
          </div>

        </div>
      );
    }

    if (user?.role === "admin")
      return null;

    if (user?.isVoted) {

      return (
        <button
          disabled
          className="py-2 px-3 rounded-md bg-gray-400 text-white cursor-not-allowed"
        >
          Already Voted
        </button>
      );
    }

    return (
      <button
        onClick={() =>
          voteCast(id)
        }
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded-md cursor-pointer transition-colors"
      >
        Vote
      </button>
    );
  };

  // ===================================
  // EDIT BUTTONS
  // ===================================
  const Editing = ({ id }) => {

    const [isAdmin,
      setIsAdmin] =
      useState(false);

    useEffect(() => {

      const user =
        getUserFromToken();

      if (
        user?.role === "admin"
      ) {

        setIsAdmin(true);
      }

    }, []);

    if (!mounted)
      return null;

    if (!isAdmin)
      return null;

    return (
      <div className="flex gap-2">


        <button
          onClick={() =>
            deleteCandidate(id)
          }
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Delete
        </button>

      </div>
    );
  };

  // ===================================
  // ADD CANDIDATE BUTTON
  // ===================================
  const AddCandidateBtn = () => {

    const [isAdmin,
      setIsAdmin] =
      useState(false);

    useEffect(() => {

      const user =
        getUserFromToken();

      if (
        user?.role === "admin"
      ) {

        setIsAdmin(true);
      }

    }, []);

    if (!mounted)
      return null;

    if (!isAdmin)
      return null;

    return (
      <Link
        href="/addcandidate"
        className="bg-slate-800 text-white hover:bg-accent py-2 px-6 rounded-md shadow-lg"
      >
        + Add Candidate
      </Link>
    );
  };

  // ===================================
  // MAIN UI
  // ===================================
  return (

    <div className="bg-background flex flex-col items-center w-full min-h-screen py-10 px-4">

      <div className="max-w-6xl w-full text-center">

        <h1 className="text-5xl font-extrabold mb-10 text-primary">
          Candidates
        </h1>

        <div className="mb-10">
          <AddCandidateBtn />
        </div>

        {loading ? (

          <div className="flex flex-col items-center">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>

            <p className="mt-4 text-primary">
              Fetching data...
            </p>

          </div>

        ) : candidates.length === 0 ? (

          <p className="text-gray-500 text-lg">
            No candidates found.
          </p>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            {candidates.map((item) => (

              <div
                key={item._id}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
              >

                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                  {item.name}
                </h2>

                <div className="my-3 space-y-1 text-gray-600">

                  <p>
                    Party:
                    <span className="font-semibold text-blue-600">
                      {" "}
                      {item.party}
                    </span>
                  </p>

                  <p>
                    Age:
                    {" "}
                    {item.age}
                  </p>

                  <p className="text-lg font-bold text-slate-800">
                    Total Votes:
                    {" "}
                    {item.voteCount}
                  </p>

                </div>

                <div className="mt-6 flex flex-col gap-3">

                  <Vote id={item._id} />

                  <Editing id={item._id} />

                </div>

              </div>
            ))}

          </div>
        )}

        {mounted &&
          !checkTokenExpiry() && (

          <p className="mt-12 text-gray-500 italic">

            Ready to participate?{" "}

            <Link
              href="/signup"
              className="text-blue-600 font-bold hover:underline"
            >
              Sign up
            </Link>

            {" "}to start voting!

          </p>
        )}
      </div>
    </div>
  );
};

export default Candidates;