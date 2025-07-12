import Thumbnail from "../../../shared/components/Thumbnail";

const SearchList = ({ data, contentType }) => {
  return (
    <div className="grid grid-cols-3 overflow-y-scroll min-h-full max-h-full h-100 gap-x-0 justify-items-center px-10 pt-10 gap-y-10">
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
