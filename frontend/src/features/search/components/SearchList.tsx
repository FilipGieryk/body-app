import Thumbnail from "../../../shared/components/Thumbnail";

type SearchListProps = {
  data: any;
  contentType: string;
};

const SearchList = ({ data, contentType }: SearchListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 overflow-y-scroll min-h-full max-h-full h-100 gap-x-0 justify-items-center px-10 pt-10 gap-y-10">
      {data.map((el, index) => (
        <Thumbnail
          className="h-fit w-100"
          data={el}
          link={`/${contentType}/${el._id}`}
          showButton={contentType === "exercises"}
        />
      ))}
    </div>
  );
};

export default SearchList;
