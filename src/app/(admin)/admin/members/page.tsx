import type { Metadata } from "next";
import { MembersClient } from "./MembersClient";

export const metadata: Metadata = { title: "Members — Admin" };

export default function MembersPage() {
  return <MembersClient />;
}
