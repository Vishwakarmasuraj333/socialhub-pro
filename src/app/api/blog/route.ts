import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
          author: {
            select: { name: true, avatar: true, role: true },
          },
        },
      });

      if (!post) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }

      // Related posts
      const related = await prisma.blogPost.findMany({
        where: {
          slug: { not: slug },
          category: post.category,
        },
        take: 3,
      });

      return NextResponse.json({ post, related });
    }

    const where: any = { published: true };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: { name: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.blogPost.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      posts,
      categories: categories.map((c) => c.category),
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { title, excerpt, content, category, tags, coverImage, readingTime } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || title,
        content,
        category: category || 'Social Strategy',
        tags: tags || 'strategy,growth',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
        readingTime: readingTime || '4 min read',
        authorId: user.id,
        published: true,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to create blog post' }, { status: 500 });
  }
}

