from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import Project


class ProjectService:
    async def create_project(
        self,
        session: AsyncSession,
        project_name: str,
        project_description: str,
        user_id: int,
    ) -> int:
        project = Project(name=project_name, description=project_description, user_id=user_id)
        session.add(project)
        await session.commit()
        await session.refresh(project)
        return project.id

    async def get_project(
        self,
        session: AsyncSession,
        user_id: int,
        project_id: int,
    ) -> Project | None:
        stmt = select(Project).where(
            Project.id == project_id,
            Project.user_id == user_id,
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_projects(
        self,
        session: AsyncSession,
        user_id: int,
    ) -> list[Project]:
        stmt = select(Project).where(Project.user_id == user_id).order_by(Project.created_at)
        result = await session.execute(stmt)
        return list(result.scalars().all())
