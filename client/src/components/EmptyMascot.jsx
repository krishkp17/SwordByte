export default function EmptyMascot({ title = "You've got this!", text = "Small steps add up to big progress." }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto grid h-24 w-24 animate-float place-items-center rounded-[2rem] bg-gradient-to-br from-teal-100 to-orange-100 text-5xl shadow-inner">
        🤖
      </div>
      <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}
