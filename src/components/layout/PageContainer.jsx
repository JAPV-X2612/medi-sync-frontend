const PageContainer = ({ children, className = "" }) => (
  <div className={`p-8 ${className}`}>{children}</div>
);

export default PageContainer;
