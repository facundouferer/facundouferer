
import Building from "./Building";

export default function Adventure() {
  return (
    <>
      <div className="grid grid-cols-3">

        <div className="col-span-2"></div>

        <div className="col-span-1">
          <Building
            href="/cuentos"
            imgSrc="/img/university.png"
            text="CUENTOS"
          />
        </div>

      </div>
    </>
  );
}