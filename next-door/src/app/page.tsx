import { markdownify } from "@/lib/utils/textConverts";
import { getListPage } from "@/lib/utils/contentParser";
import { Button, Feature } from "@/types";
import Link from "next/link";
import ImageFallback from "@/layouts/helpers/ImageFallback";

export default function Home() {
  const homepage = getListPage("homepage/_index.md");

  const { frontmatter } = homepage;

  const {
    banner,
    feature,
  }: {
    banner: { title: string; image: string; content?: string; button?: Button };
    feature: Feature[];
  } = frontmatter;

  return (
    <>
      <div className="container">
        <div className="row justify-center">
          <div className="mb-16 text-center lg:col-7">
            <h1
              className="mb-4"
              dangerouslySetInnerHTML={markdownify(banner.title)}
            />
            <p
              className="mb-8"
              dangerouslySetInnerHTML={markdownify(banner.content ?? "")}
            />
            {banner.button!.enable && (
              <Link
                className="btn btn-primary"
                href={banner.button!.link}
                target={
                  banner.button!.link.startsWith("http") ? "_blank" : "_self"
                }
                rel="noopener"
              >
                {banner.button!.label}
              </Link>
            )}
          </div>
          {banner.image && (
            <div className="col-12">
              <ImageFallback
                src={banner.image}
                className="mx-auto"
                width="800"
                height="420"
                alt="banner image"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
