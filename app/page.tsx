import { redirect } from 'next/navigation';
import Header from "./component/header";

export default function page() {
  redirect('/home');
}
