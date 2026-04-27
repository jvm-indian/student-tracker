import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const field = searchParams.get("field")
  const search = searchParams.get("search")
  const limit = parseInt(searchParams.get("limit") || "10")
  const offset = parseInt(searchParams.get("offset") || "0")

  let query = supabase
    .from("research_articles")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (field && field !== "all") {
    query = query.eq("field", field)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,abstract.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, abstract, content, pdf_url, authors, category, field, keywords } = body

  const { data, error } = await supabase
    .from("research_articles")
    .insert({
      title,
      abstract,
      content,
      pdf_url,
      authors,
      category,
      field,
      keywords,
      submitted_by: user.id,
      status: "draft"
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
