
import Building from "./Building";
import Tree from "./Tree";

export default function Adventure() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3">

        <div className="col-span-3">
          <Tree arboles={4} />
        </div>

        <div className="col-span-1">
          <Tree arboles={1} />
        </div>

        <div className="col-span-1">
          <Building
            href="/cuentos"
            imgSrc="/img/university.png"
            text="CUENTOS"
          />
        </div>

        <div className="col-span-1">
          <Tree arboles={1} />
        </div>

        <div className="col-span-3">
          <Tree arboles={6} />
        </div>

      </div>
    </div>
  );
}