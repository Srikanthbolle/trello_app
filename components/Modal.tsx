"use client";

import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { shallow } from "zustand/shallow";
import { useModalStore } from "../Store/ModalStore";
import { useBoardStore } from "../Store/BoardStore";
import TaskTypedRadioGroup from "./TaskTypedRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/16/solid";

function Modal() {
  const isOpen = useModalStore((state) => state.isOpen);
  const closeModal = useModalStore((state) => state.closeModal);
  const newTaskInput = useBoardStore((state) => state.newTaskInput);
  const setNewTaskInput = useBoardStore((state) => state.setNewTaskInput);
  const imagePickerRef = useRef(null);
  const image = useBoardStore((state) => state.image);
  const setImage = useBoardStore((state) => state.setImage);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 w-screen overflow-y-auto">
          {/* Container to center the panel */}
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a task here ..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                <TaskTypedRadioGroup />
                <div>

                <button className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                  <PhotoIcon className="w-6 h-6 inline-block mr-2"/>
                  Upload Image
                </button>

                  {image && (
                    <Image
                      width={200}
                      height={200}
                      alt="Upload Image"
                      src={URL.createObjectURL(image)}
                      className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                      onClick={()=>{
                        setImage(null)
                      }}
                    />
                  )}
                  <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImage(e.target.files![0]);
                    }}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;