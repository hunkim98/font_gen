import { Inter } from "next/font/google";
import { Dotting, DottingRef, useBrush } from "dotting";
import { createPixelDataSquareArray } from "@/utils/data";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { PostStrokesBodyDto } from "@/types/PostStroke/body/post.strokes.body.dto";
import { PostStrokeResponseDto } from "@/types/PostStroke/response/post.stroke.res.dto";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const dottingRef = useRef<DottingRef>(null);
  const { changeBrushPattern } = useBrush(dottingRef);
  const [svgResults, setSvgResults] = useState<Array<string>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onClickGenerate = () => {
    const dotting = dottingRef.current;
    if (!dotting) return;
    const layers = dotting.getLayersAsArray();
    const layer = layers[0];
    if (!layer) return;
    const data = layer.data;
    const rowCount = data.length;
    const columnCount = data[0].length;
    const pixelDataArray: Array<Array<number>> = [];
    for (let i = 0; i < rowCount; i++) {
      const tempRow = [];
      const row = data[i];
      for (let j = 0; j < columnCount; j++) {
        const pixel = row[j];
        if (pixel.color) {
          tempRow.push(1);
        } else {
          tempRow.push(0);
        }
      }
      pixelDataArray.push(tempRow);
    }
    const body: PostStrokesBodyDto = {
      strokes: pixelDataArray,
    };
    setIsLoading(true);
    axios
      .post("/gen", body)
      .then((res) => {
        const data = res.data as PostStrokeResponseDto;
        const svgs = data.result;
        const svg1 = svgs[0];
        // draw svg in cavas
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        // Parse the SVG string
        const img1 = new Image();
        img1.onload = function () {
          ctx.clearRect(0, 0, 500, 500);
          ctx.drawImage(img1, 0, 0, 500, 500);
        };
        console.log(svg1[0]);
        img1.src =
          "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg1);
        setSvgResults(svgs);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    changeBrushPattern([
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ]);
  }, [changeBrushPattern, dottingRef.current]);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="flex flex-wrap gap-3 justify-center">
        <div
          className="w-[500px] h-[500px]"
          style={{
            backgroundColor: "white",
          }}
        >
          {isLoading && (
            <div className="absolute w-[500px] h-[500px] flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white">Loading...</div>
            </div>
          )}
          <canvas ref={canvasRef} id="canvas" width="500" height="500"></canvas>
        </div>
        <div className="">
          <h3 className="text-xl font-bold">Draw Skeleton</h3>
          <Dotting
            ref={dottingRef}
            width={300}
            height={300}
            initLayers={[
              {
                id: "layer1",
                data: createPixelDataSquareArray(256, 256, 0, 0),
              },
            ]}
            isGridFixed={true}
            isGridVisible={false}
            brushColor="#000000"
          />
          <div className="flex flex-col gap-1 mt-1">
            <button
              className="bg-gray-500 text-white px-4 py-1 rounded"
              onClick={() => dottingRef.current?.clear()}
            >
              clear
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => dottingRef.current?.undo()}
            >
              undo
            </button>

            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={onClickGenerate}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
