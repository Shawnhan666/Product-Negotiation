import React from "react";
import { Button } from "../components/Button";

export function Introduction({ next }) {
  return (
    <div className="mt-3 sm:mt-5 p-20">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        {/* 这里添加introduction的介绍  */}
        Instruction One
      </h3>
      <div className="mt-2 mb-6">
        <p className="text-sm text-gray-500">
          131231231.
        </p>
      </div>
      <Button handleClick={next} autoFocus>
        <p>Next</p>
      </Button>
    </div>
  );
}
