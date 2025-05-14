import Image from "next/image";
import Header from "../../components/Header";
import Board from "../../components/Board"
import Modal from "../../components/Modal";



export default function Home() {
  return (
   <main>
    {/* header */}
    <Header/>

    {/* board */}

    <Board />
    <Modal />
   </main>
  );
}
