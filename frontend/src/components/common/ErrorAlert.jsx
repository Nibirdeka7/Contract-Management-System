export const ErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      <div className="flex justify-between items-center">
        <span className="text-sm">{error}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-700 hover:text-red-900 font-bold ml-4"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};