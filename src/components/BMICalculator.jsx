"use client";

import { motion, AnimatePresence } from "motion/react";

import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import {
  errorSet,
  fieldChanged,
  resultSet,
  unitChanged,
} from "../lib/store/slices/bmiSlice";
import { calculateBmi, validateBmiInput } from "../lib/bmi";
import {
  fadeLeft,
  fadeRight,
  fadeUp,
} from "./animations/motionVariants";


export default function BMICalculator() {

  // Form values and the result live in the bmi slice.
  const dispatch = useAppDispatch();

  const {
    unit,
    heightCm,
    weightKg,
    heightFt,
    heightIn,
    weightLbs,
    bmi,
    category,
    error,
  } = useAppSelector((state) => state.bmi);

  const setField = (field) => (value) =>
    dispatch(fieldChanged({ field, value }));

  const setHeightCm = setField("heightCm");
  const setWeightKg = setField("weightKg");
  const setHeightFt = setField("heightFt");
  const setHeightIn = setField("heightIn");
  const setWeightLbs = setField("weightLbs");


  /*
    =========================
    CALCULATE BMI
    =========================
  */

  const calculateBMI = () => {

    const input = {
      unit,
      heightCm,
      weightKg,
      heightFt,
      heightIn,
      weightLbs,
    };

    // Reject blank, negative, zero and unrealistic values before they
    // reach the formula (height 0 would otherwise show "Infinity").
    const validationError = validateBmiInput(input);

    if (validationError) {
      dispatch(errorSet(validationError));
      return;
    }

    dispatch(resultSet(calculateBmi(input)));
  };


  /*
    =========================
    CHANGE UNIT
    =========================
  */

  const changeUnit = (newUnit) => {
    dispatch(unitChanged(newUnit));
  };


  return (
    <section className="overflow-hidden bg-[#f7f9f3] px-6 py-24 lg:px-8 lg:py-32">

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">


        {/* =========================
            IMAGE
        ========================= */}

        <motion.div
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="relative"
        >

          <motion.div
            initial={{
              scale: 0.7,
              opacity: 0,
            }}

            whileInView={{
              scale: 1,
              opacity: 1,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}

            className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#e4eedc]"
          />


          <motion.div
            whileHover={{
              scale: 1.02,
            }}

            transition={{
              duration: 0.5,
            }}

            className="relative overflow-hidden rounded-[30px]"
          >

            <img
              src="/images/bmi.webp"
              alt="Nutrition specialist"
              className="h-[500px] w-full object-cover"
            />

          </motion.div>


          {/* Floating card */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              delay: 0.4,
              duration: 0.6,
            }}

            className="absolute bottom-6 left-6 rounded-2xl bg-white px-6 py-5 shadow-xl"
          >

            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-green-600">
              Healthy Living
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              Know Your BMI
            </p>

          </motion.div>

        </motion.div>


        {/* =========================
            CALCULATOR
        ========================= */}

        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
        >

          <motion.div
            variants={fadeUp}
            className="mb-4 flex items-center gap-3"
          >

            <span className="h-[2px] w-10 bg-green-600" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
              Our Services
            </span>

          </motion.div>


          <h2 className="text-4xl font-bold capitalize leading-tight text-gray-900 sm:text-5xl">
            Calculate Body

            <span className="block text-green-600">
              Mass Index
            </span>
          </h2>


          {/* Unit selector */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              delay: 0.2,
            }}

            className="mt-8 inline-flex rounded-full bg-white p-1 shadow-sm"
          >

            <button
              type="button"
              onClick={() => changeUnit("metric")}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                unit === "metric"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Metric
            </button>

            <button
              type="button"
              onClick={() => changeUnit("imperial")}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                unit === "imperial"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Imperial
            </button>

          </motion.div>


          {/* Calculator box */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              delay: 0.3,
              duration: 0.7,
            }}

            className="mt-6 rounded-[24px] bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.06)] sm:p-8"
          >

            {/* METRIC */}

            <AnimatePresence mode="wait">

              {unit === "metric" ? (

                <motion.div
                  key="metric"
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 20,
                  }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2"
                >

                  <Input
                    label="Height"
                    value={heightCm}
                    setValue={setHeightCm}
                    placeholder="Enter height"
                    suffix="CM"
                  />

                  <Input
                    label="Weight"
                    value={weightKg}
                    setValue={setWeightKg}
                    placeholder="Enter weight"
                    suffix="KG"
                  />

                </motion.div>

              ) : (

                /* IMPERIAL */

                <motion.div
                  key="imperial"
                  initial={{
                    opacity: 0,
                    x: 20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  className="space-y-5"
                >

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Height
                    </label>

                    <div className="grid grid-cols-2 gap-4">

                      <Input
                        value={heightFt}
                        setValue={setHeightFt}
                        placeholder="Feet"
                        suffix="FT"
                      />

                      <Input
                        value={heightIn}
                        setValue={setHeightIn}
                        placeholder="Inches"
                        suffix="IN"
                      />

                    </div>

                  </div>

                  <Input
                    label="Weight"
                    value={weightLbs}
                    setValue={setWeightLbs}
                    placeholder="Enter weight"
                    suffix="LBS"
                  />

                </motion.div>

              )}

            </AnimatePresence>


            {/* Validation error */}

            {error && (
              <p
                role="alert"
                className="mt-4 text-sm font-medium text-red-600"
              >
                {error}
              </p>
            )}


            {/* Calculate button */}

            <motion.button
              type="button"
              onClick={calculateBMI}

              whileHover={{
                y: -4,
                scale: 1.02,
              }}

              whileTap={{
                scale: 0.97,
              }}

              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-green-600 px-7 py-4 text-sm font-semibold text-white"
            >

              Calculate

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>

            </motion.button>


            {/* BMI result */}

            <AnimatePresence>

              {bmi && (

                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: 15,
                  }}

                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}

                  exit={{
                    opacity: 0,
                    height: 0,
                  }}

                  transition={{
                    duration: 0.4,
                  }}

                  className="mt-6 overflow-hidden rounded-2xl bg-[#f7f9f3] p-5"
                >

                  <p className="text-sm font-medium text-gray-500">
                    Your BMI
                  </p>

                  <div className="mt-1 flex items-end gap-3">

                    <motion.span
                      initial={{
                        scale: 0.7,
                      }}

                      animate={{
                        scale: 1,
                      }}

                      className="text-4xl font-bold text-gray-900"
                    >
                      {bmi}
                    </motion.span>

                    <span className="pb-1 text-sm font-semibold text-green-600">
                      {category}
                    </span>

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}


/*
  =========================
  INPUT COMPONENT
  =========================
*/

function Input({
  label,
  value,
  setValue,
  placeholder,
  suffix,
}) {
  return (
    <div>

      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}

      <div className="relative">

        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 pr-14 text-sm outline-none transition-all duration-300 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
          {suffix}
        </span>

      </div>

    </div>
  );
}
