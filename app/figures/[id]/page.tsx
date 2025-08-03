import { generateMetadata as genMeta } from './metadata'
import FigureDetailsClient from './client'

export const generateMetadata = genMeta

export default async function FigureDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <FigureDetailsClient params={resolvedParams} />
}
