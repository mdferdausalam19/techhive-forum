import { FiPlus } from "react-icons/fi";

export default function AdminPageHeader({
  title,
  description,
  buttonText,
  onButtonClick,
  icon: Icon,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          {Icon && <Icon className="mr-2 text-blue-600" />}
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          {buttonText}
        </button>
      )}
    </div>
  );
}
