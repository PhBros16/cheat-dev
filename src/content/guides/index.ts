import loginForm from "@/content/guides/login-form";
import flexbox from "@/content/guides/flexbox";
import gridLayout from "@/content/guides/grid-layout";
import fetchApi from "@/content/guides/fetch-api";
import sqlIniciantes from "@/content/guides/sql-iniciantes";
import githubVercel from "@/content/guides/github-vercel";
import { Guide } from "@/lib/types";

export const guides: Guide[] = [githubVercel, loginForm, flexbox, gridLayout, fetchApi, sqlIniciantes];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}
