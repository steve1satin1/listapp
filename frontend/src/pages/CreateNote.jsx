import Datetime from "react-datetime";
import { useEffect, useState } from "react";
import "react-datetime/css/react-datetime.css";
import { CalendarClock, LoaderCircle } from "lucide-react";
import { X } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const CreateNote = () => {
  let navigate = useNavigate();

  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

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
      setLoading(true);

      await api.post("/create", {
        title: title,
        description: description,
        until: date ? date.UTC().format("YYYY-MM-DDTHH:mm") : null,
      });

      navigate("/");
      setLoading(false);
      toast.success("Note saved successfully!");
    } catch (error) {
      // Auth
      if (error.status === 401) {
        return navigate("/login_register");
      }

      toast.error("Note did't saved!");
      console.error("Error at handleSubmit on create Note: ", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
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
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className={`text-red-500 ${title === "" ? "inline" : "hidden"}`}>
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
                <summary className="btn m-1">
                  <div className="flex justify-between items-center gap-5 text-lg">
                    <CalendarClock />
                    {date && <span>{date.format("DD/MM/YYYY HH:mm")}</span>}
                    {date && (
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => setDate(null)}
                      >
                        <X />
                      </button>
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
              disabled={loading ? true : false}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary text-lg"
              onClick={handleSubmit}
              disabled={loading ? true : false}
            >
              {loading && <LoaderCircle className="animate-spin" />} Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
