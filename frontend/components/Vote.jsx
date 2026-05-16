import axios from "axios";

function Vote() {

  const submitVote = async () => {

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {

          const response = await axios.post(
            "http://localhost:5000/api/vote",
            {
              userId: "PUT_REAL_USER_ID",
              candidate: "Candidate A",
              latitude,
              longitude,
            }
          );

          alert(response.data.message);

        } catch (err) {

          if (err.response?.data?.suspicious) {
            alert("Suspicious vote detected");
          } else {
            alert("Vote failed");
          }

        }

      },

      () => {
        alert("Location permission denied");
      }
    );
  };

  return (
    <button onClick={submitVote}>
      Vote
    </button>
  );
}

export default Vote;