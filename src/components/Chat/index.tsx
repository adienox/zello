import Messages from "./Messages";
import TopBar from "./TopBar";

const index = () => {
  return (
    <div className="bg-primary md:block md:h-[calc(90vh-92px)] md:p-5 md:pb-0">
      <div className="overflow-hidden bg-primaryDark md:rounded-2xl md:rounded-b-none">
        <TopBar />
        <Messages />
      </div>
    </div>
  );
};

export default index;
