import Datetime from "react-datetime";
import { useEffect, useState } from "react";
import "react-datetime/css/react-datetime.css";
import { CalendarClock, LoaderCircle } from "lucide-react";
import { X } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import moment from "moment";

export const DetailsNote = () => {
  const [date, setDate] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  let navigate = useNavigate();

  // Load parameters
  const params = useParams();
  if (!params) {
    toast.error("No id provided");
    navigate("/notfound");
  }

  // Load Note's data
  useEffect(() => {
    async function fetchData() {
      try {
        const note = await api.get(`/${params.id}`);
        console.log("note: ", note);

        setTitle(note.data[0].title);

        setDescription(note.data[0].description);

        if (note.data[0].until) {
          setDate(moment(note.data[0].until));
        }

        setLoading(false);
      } catch (error) {
        // Auth
        if (error.status === 401) {
          return navigate("/login_register");
        }

        console.log(`Error while fetching note: ${params.id} data: ${error}`);
        toast.error("The specified note is not in the database!");
        navigate("/notfound");
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    // Check if title and description is filled in
    if (!(title && description)) {
      toast.error("Title and desription are required!");
      setTitle("");
      setDescription("");
      return;
    }
    // Send the note to backend
    try {
      setSaveLoading(true);

      await api.put(`/modify/${params.id}`, {
        title: title,
        description: description,
        until: date ? date.toISOString() : null,
      });

      navigate("/");
      setSaveLoading(false);
      toast.success("Note saved successfully!");
    } catch (error) {
      toast.error("Note did't saved!");
      console.error("Error at handleSubmit on create Note: ", error);
      setSaveLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      {console.log(
        `title: ${title}\ndescription: ${description}\ndate: ${date}`,
      )}
      {loading ? (
        <div className="w-full flex justify-center my-10">
          <LoaderCircle size={64} className="animate-spin" />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex flex-col gap-5 card card-bordered border-t-primary border-t-8 bg-base-100 w-96 shadow-xl p-7 my-20">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-lg font-semibold">Title</span>
              </div>
              <input
                type="text"
                maxLength={20}
                placeholder="Type here"
                className={`input input-bordered w-full max-w-xs ${title === "" && "input-error"}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p
                className={`text-red-500 ${title === "" ? "inline" : "hidden"}`}
              >
                Title is required!
              </p>
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text text-lg font-semibold">
                  Description
                </span>
              </div>
              <textarea
                name="descInput"
                maxLength={100}
                placeholder="Note description"
                className={`textarea textarea-bordered textarea-lg w-full max-w-xs ${description === "" && "textarea-error"}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <p
                className={`text-red-500 ${description === "" ? "inline" : "hidden"}`}
              >
                Description is required!
              </p>
            </label>

            <div className="flex justify-between">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-lg font-semibold">
                    Set a deadline
                  </span>
                </div>
                <details className="dropdown">
                  <summary className="btn">
                    <div className="flex justify-between items-center gap-5 text-lg">
                      <CalendarClock />
                      {date && <span>{date.format("DD/MM/YYYY HH:mm")}</span>}
                      {date && (
                        <span
                          role="button"
                          className="btn btn-error btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDate(null);
                          }}
                        >
                          <X />
                        </span>
                      )}
                    </div>
                  </summary>
                  <div className="menu dropdown-content bg-base-100">
                    <div>
                      <Datetime
                        initialValue={new Date()}
                        value={date}
                        onChange={setDate}
                        input={false}
                      />
                    </div>
                  </div>
                </details>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <button
                className="btn text-lg"
                onClick={() => navigate("/")}
                disabled={saveLoading ? true : false}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary text-lg"
                onClick={handleSubmit}
                disabled={saveLoading ? true : false}
              >
                {saveLoading && <LoaderCircle className="animate-spin" />} Save
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
