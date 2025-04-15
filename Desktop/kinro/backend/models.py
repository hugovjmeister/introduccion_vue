# backend/models.py
from sqlalchemy import Column, String, ForeignKey, Enum, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB  # Cambiar a JSONB
from sqlalchemy.orm import relationship, declarative_base
import uuid

Base = declarative_base()

class ClassModel(Base):
    __tablename__ = "class_models"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    position_x = Column(Float, default=0.0)
    position_y = Column(Float, default=0.0)
    attributes = relationship("Attribute", back_populates="class_model", cascade="all, delete-orphan", lazy="selectin")
    data_entries = relationship("Data", back_populates="class_model", cascade="all, delete-orphan", lazy="selectin")

class Attribute(Base):
    __tablename__ = "attributes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    data_type = Column(String, nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("class_models.id", ondelete="CASCADE"), nullable=False)
    class_model = relationship("ClassModel", back_populates="attributes", lazy="selectin")
    properties = relationship("Property", back_populates="attribute", cascade="all, delete-orphan", lazy="selectin")

class Property(Base):
    __tablename__ = "properties"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attribute_id = Column(UUID(as_uuid=True), ForeignKey("attributes.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    value = Column(String, nullable=False)
    attribute = relationship("Attribute", back_populates="properties", lazy="selectin")

class Data(Base):
    __tablename__ = "data"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_id = Column(UUID(as_uuid=True), ForeignKey("class_models.id", ondelete="CASCADE"), nullable=False)
    content = Column(JSONB, nullable=False)  # Cambiado a JSONB

    class_model = relationship("ClassModel", back_populates="data_entries", lazy="selectin")

class Connection(Base):
    __tablename__ = "connections"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_class = Column(UUID(as_uuid=True), ForeignKey("class_models.id"))
    target_class = Column(UUID(as_uuid=True), ForeignKey("class_models.id"))
    relationship_type = Column(
    Enum("1-1", "1-N", "N-N", name="relationship_types", create_type=True), 
    nullable=False
)

print("🔹 Tablas detectadas por SQLAlchemy:")
for table_name in Base.metadata.tables.keys():
    print(f"✅ {table_name}")