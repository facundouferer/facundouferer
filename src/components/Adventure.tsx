
import Building from "./Building";
import Tree from "./Tree";

export default function Adventure() {
  return (
    <>
      <div className="grid grid-cols-3">

        <div className="col-span-2">
          <Tree arboles={3} />
        </div>

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