import api from "../lib/axios.js";
import { useEffect, useState } from "react";
import {
  LoaderCircle,
  SquarePen,
  Trash2,
  UserPlus2,
  NotebookPen,
} from "lucide-react";
import { dateDiff } from "../utils/dateDiff.js";
import { NavLink, useNavigate } from "react-router";
import toast from "react-hot-toast";

export const HomePage = ({ isLoggedIn }) => {
  let navigate = useNavigate();

  // Date options
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false, // Εξαναγκασμός σε 24ωρη μορφή
  };

  // States
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchNotes, setFetchNotes] = useState(false);

  // Fetch notes
  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedNotes = await api.get("/");
        setNotes(fetchedNotes.data);
        setLoading(false);
      } catch (error) {
        // Auth
        if (error.status === 401) {
          return navigate("/login_register");
        }
        console.log("Error at HomePage: ", error);
      }
    }
    fetchData();
  }, [fetchNotes]);

  // Delete handler
  const handleDelete = async (id) => {
    try {
      let endpoint = `/delete/${id}`;

      const res = await api.delete(endpoint);

      if (res.status != 200) {
        console.log(
          "Erro at delete handler status code: ",
          res.status,
          "\n",
          res.data,
        );
        return;
      }

      setFetchNotes(!fetchNotes);
    } catch (error) {
      console.log("Error at delete handler: ", error);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        loading ? (
          <div className="w-full flex justify-center my-10">
            <LoaderCircle size={64} className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 justify-self-center justify-center items-start">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <div
                  key={index}
                  className="card bg-base-100 w-xs md:w-96 shadow-xl mx-10 my-5"
                >
                  <div className="card-body">
                    <h2 className="card-title">{note.title}</h2>
                    <p className="text-wrap">{note.description}</p>
                    <div className="flex justify-between items-center">
                      {note.until && (
                        <div
                          className={`badge badge-${dateDiff(note.until) >= 0 ? "success" : "error"} badge-outline`}
                        >
                          {new Date(note.until).toLocaleString(
                            undefined,
                            options,
                          )}
                        </div>
                      )}
                      <div className="flex">
                        <NavLink to={`/details/${note._id}`} end>
                          <button className="btn btn-ghost btn-sm">
                            <SquarePen size={22} />
                          </button>
                        </NavLink>

                        <button
                          className="btn btn-error btn-sm btn-ghost"
                          onClick={() => handleDelete(note._id)}
                        >
                          <Trash2 size={22} color="#C3110C" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center my-20 items-center col-span-3 gap-5">
                <NotebookPen size={75} />
                <h1 className="text-lg font-bold">
                  You have no Notes, Please add a note.
                </h1>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="flex justify-center py-5">
          <div className="flex items-center gap-5 bg-base-100 w-96 shadow-xl p-10 rounded-lg">
            <UserPlus2 size={50} />
            <h1 className="text-lg font-bold">
              Please Log In in order to create a new note!
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};
