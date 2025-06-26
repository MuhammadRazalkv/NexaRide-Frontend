import { Rate } from "antd";
interface RatingProps {
  handleChange: (rating: number) => void;
  handleComments: (value: string) => void;
  closeModal: () => void;
  error?: string;
  submitReview: () => void;
}

const RatingModal: React.FC<RatingProps> = ({
  handleChange,
  handleComments,
  closeModal,
  submitReview,
  error,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fade-in space-y-5">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Give Feedback
        </h2>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex flex-col items-center gap-4">
          <Rate
            allowHalf
            defaultValue={0}
            style={{ fontSize: "36px" }}
            allowClear={false}
            onChange={handleChange}
          />
          <textarea
            className="w-full p-4 rounded-lg bg-gray-100 text-gray-700 resize-none outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            onChange={(e) => handleComments(e.target.value)}
            placeholder="Enter your comments here..."
          ></textarea>
        </div>

        <div className="flex justify-end pt-2 gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-black hover:bg-neutral-800 text-white"
            onClick={submitReview}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
