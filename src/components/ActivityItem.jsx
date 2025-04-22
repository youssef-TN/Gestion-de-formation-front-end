export default ({ icon, title, time }) => (
	<li className="flex items-start">
	  <div className="rounded-full p-2 mr-4 bg-[#EAF1E6]">
		{icon}
	  </div>
	  <div>
		<p className="font-medium text-gray-800">{title}</p>
		<p className="text-sm text-gray-500">{time}</p>
	  </div>
	</li>
  );