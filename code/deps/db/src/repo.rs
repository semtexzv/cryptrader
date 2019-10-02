use std::marker::PhantomData;

use diesel::{insert_into, Identifiable, Table, ExpressionMethods, Expression, SelectableExpression};
use diesel::connection::Connection;
use diesel::query_builder::{Query, AsQuery, QueryFragment, QueryId, InsertStatement, AsChangeset, IntoUpdateTarget};
use diesel::backend::Backend;
use diesel::associations::{HasTable, BelongsTo};
use diesel::query_dsl::select_dsl::SelectDsl;
use diesel::sql_types::HasSqlType;
use diesel::helper_types::{Filter, Select};
use diesel::expression::helper_types::SqlTypeOf;
use diesel::dsl::{FindBy, Eq, Update};
use diesel::query_dsl::filter_dsl::{FilterDsl, FindDsl};
use diesel::expression::{AsExpression, NonAggregate};
use diesel::query_builder::UpdateStatement;
use diesel::pg::Pg;


pub struct Repository<DB: Backend, C: Connection<Backend=DB>>(PhantomData<(DB, C)>);


//type IdOf<'a, T> = <&'a T as Identifiable>::Id;
type TablePk<T> = <<T as HasTable>::Table as Table>::PrimaryKey;
type TableOf<T> = <T as HasTable>::Table;

pub trait GetAllDsl<T: HasTable> {
    type Output;
    fn get_all() -> Self::Output;
}

pub trait IdentifiedByDsl<Expr>: HasTable {
    type Output;
    fn identified_by(id: Expr) -> Self::Output;
}

impl<T: HasTable> GetAllDsl<T> for T
    where T::Table: AsQuery + SelectDsl<<T::Table as Table>::AllColumns>,
{
    type Output = Select<T::Table, <T::Table as Table>::AllColumns>;

    fn get_all() -> Self::Output { SelectDsl::select(T::table(), T::Table::all_columns()) }
}

pub trait ReferencedByDsl<'a, O, Expr>
    where &'a O: Identifiable,
          O: 'a
{
    type Output;
    fn referenced_by(id: Expr) -> Self::Output;
}


impl<'a, T, Expr> IdentifiedByDsl<Expr> for T
    where T: 'a + HasTable,
          &'a Self: Identifiable,
          TableOf<Self>: FilterDsl<Eq<TablePk<Self>, Expr>>,
          Expr: AsExpression<SqlTypeOf<TablePk<Self>>>,
          TablePk<Self>: ExpressionMethods
{
    type Output = FindBy<TableOf<Self>, TablePk<Self>, Expr>;

    fn identified_by(id: Expr) -> Self::Output {
        FilterDsl::filter(Self::table(), Self::table().primary_key().eq(id))
    }
}


impl<'a, This, Other: 'a, Expr> ReferencedByDsl<'a, Other, Expr> for This
    where &'a Other: Identifiable,
          This: HasTable + BelongsTo<Other>,
          Expr: AsExpression<<This::ForeignKeyColumn as Expression>::SqlType>,
          This::Table: FilterDsl<Eq<This::ForeignKeyColumn, Expr>>,
          This::ForeignKeyColumn: ExpressionMethods,
{
    type Output = FindBy<TableOf<This>, This::ForeignKeyColumn, Expr>;

    fn referenced_by(id: Expr) -> Self::Output {
        FilterDsl::filter(This::table(), This::foreign_key_column().eq(id))
    }
}

pub fn referenced_by<'a, This, Other, Expr>(id: Expr) -> This::Output
    where &'a Other: Identifiable,
          This: ReferencedByDsl<'a, Other, Expr>
{
    This::referenced_by(id)
}