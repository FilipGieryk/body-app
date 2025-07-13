const Photos = ({
  userPhotos,
  isLoggedUser,
  handleFileChangeAndAdd,
  handleDeletePhotos,
}) => {
  return (
    <div className="flex relative items-center w-[90%] h-full m-auto py-2 text-4xl bg-amber-200 rounded-2xl whitespace-nowrap shadow-xl">
      {userPhotos?.length > 0 ? (
        userPhotos.map((photo) => (
          <div className="inline-block min-w-100 h-[95%] rounded-4xl relative">
            <img
              className="w-60 h-80 overflow-hidden rounded-4xl"
              src={`http://localhost:5173/uploads/${photo}`}
              loading="lazy"
            ></img>
            <button
              className="absolute top-[10%] right-4 bg-transparent border-0 text-gray-400 translate-[50% -50%] transition-all"
              onClick={() => handleDeletePhotos(photo)}
              // disabled={deletePhotoStatus.isPending}
            >
              {/* {deletePhotoStatus.isPending ? "Deleting..." : "Delete"}X */}
            </button>
          </div>
        ))
      ) : (
        <></>
      )}

      {isLoggedUser && (
        <div className="inline-block min-w-100 h-[95%] rounded-4xl relative">
          <span className="absolute flex top-[50%] left-[50%] w-20 h-20 text-7xl rounded-4xl translate-[-50% -50%] text-center justify-center items-center transition-all">
            +
          </span>
          <input
            type="file"
            id="file-upload"
            className="absolute flex top-[50%] left-[50%] w-20 h-20 text-7xl rounded-4xl translate-[-50% -50%] text-center justify-center items-center transition-all"
            onChange={handleFileChangeAndAdd}
            multiple
          />
        </div>
      )}
    </div>
  );
};

export default Photos;
