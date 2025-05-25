export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">프로필 설정</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">이름</label>
          <input type="text" id="name" className="w-full p-2 rounded-md" />
        </div>
      </div>
    </div>
  );
}
