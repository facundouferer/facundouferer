
import Building from "./Building";
import Tree from "./Tree";

export default function Adventure() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4">

        <div className="col-span-4">
          <Tree arboles={4} />
        </div>

        <div className="col-span-1">
          <Tree arboles={1} />
        </div>

        <div className="col-span-1">
          <Building
            href="/cuentos"
            imgSrc="/img/buildings/cuentos.png"
            text="CUENTOS"
          />
        </div>

        <div className="col-span-1">
          <Tree arboles={1} />
        </div>

        <div className="col-span-1">
          <Building
            href="/university"
            imgSrc="/img/buildings/university.png"
            text="APRENDER"
          />
        </div>

        <div className="col-span-4">
          <Tree arboles={4} />
        </div>

      </div>
    </div>
  );
}