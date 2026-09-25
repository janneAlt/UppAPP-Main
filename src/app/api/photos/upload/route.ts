import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { photoPathPrefix } from "@/lib/uploads";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/validations";

// Issues short-lived tokens so the browser can upload photos directly to
// Vercel Blob, bypassing the 4.5 MB request body limit on Vercel functions.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const session = await auth();
        if (!session?.user) {
          throw new Error("Du måste vara inloggad för att ladda upp foton.");
        }

        const { contestId } = JSON.parse(clientPayload ?? "{}") as { contestId?: string };
        if (!contestId || !pathname.startsWith(photoPathPrefix(contestId))) {
          throw new Error("Ogiltig uppladdning.");
        }

        const contest = await prisma.contest.findUnique({ where: { id: contestId } });
        if (!contest || contest.status !== "SUBMISSION") {
          throw new Error("Tävlingen tar inte emot bidrag just nu.");
        }

        return {
          allowedContentTypes: ACCEPTED_IMAGE_TYPES,
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
