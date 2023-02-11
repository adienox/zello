import Chats from "./Chats";
import SearchBox from "./SearchBox";

const Index = () => {
  return (
    <div className="h-[100vh] overflow-hidden bg-primary p-5 md:h-[calc(90vh-92px)]">
      <SearchBox />
      <Chats />
    </div>
  );
};

export default Index;
