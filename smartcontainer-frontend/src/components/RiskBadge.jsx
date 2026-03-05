const RiskBadge = ({ level }) => {
  const colors = {
    LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[level] || colors.LOW}`}>
      {level}
    </span>
  );
};

export default RiskBadge;
