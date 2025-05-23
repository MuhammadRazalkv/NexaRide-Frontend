type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
};

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
  <div className="bg-[#1A2036] h-36 rounded-lg shadow flex flex-col items-center justify-center space-y-2 hover:shadow-2xl hover:shadow-blue-800">
    <div className="text-xl">{icon}</div>
    <div className="text-md">{label}</div>
    <div className="text-2xl font-semibold">{value || 'N/A'}</div>
  </div>
);

export default InfoCard